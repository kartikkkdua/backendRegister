import { Counter } from "../model/counter.model.js";
import { Team } from "../model/team.model.js";
import { Parser } from "json2csv";
import fs from "fs";

export const findTeams = async(req, res) => {
  try {
    const { event } = req.body;

    // Ensure 'events' is always an array
    const events = Array.isArray(event) ? event : [event];

    // Find teams where 'selectedEvents' contains all of the provided events
    const teams = await Team.find({ selectedEvents: { $all: events } });

    const eventCounts = await Counter.find()

    const dataToExport = teams.map(team => ({
      teamName: team.teamName,
      leaderName: team.leaderName,
      email: team.email,
      sapId: team.sapId,
      degree: team.degree,
      yearOfStudy: team.yearOfStudy,
      phoneNumber: team.phoneNumber,
      isUPESStudent: team.isUPESStudent,
      alternateNumber: team.alternateNumber,
      isPrimeMember: team.isPrimeMember,
      primeId: team.primeId,
      selectedEvents: team.selectedEvents.join(', '),
      strength: team.strength,
      transactionId: team.transactionId,
      totalAmount: team.totalAmount,
      paymentSignature: team.paymentSignature,
      teamMembers: team.teamMembers.map(member => ({
        name: member.name,
        sapId: member.sapId,
        degree: member.degree,
        yearOfStudy: member.yearOfStudy,
        phoneNumber: member.phoneNumber,
        email: member.email,
        isPrimeMember: member.isPrimeMember,
        primeId: member.primeId
      }))
    }));

    const fields = [
      { label: 'Team Name', value: 'teamName' },
      { label: 'Leader Name', value: 'leaderName' },
      { label: 'Email', value: 'email' },
      { label: 'SAP ID', value: 'sapId' },
      { label: 'Degree', value: 'degree' },
      { label: 'Year of Study', value: 'yearOfStudy' },
      { label: 'Phone Number', value: 'phoneNumber' },
      { label: 'Is UPES Student', value: 'isUPESStudent' },
      { label: 'Alternate Number', value: 'alternateNumber' },
      { label: 'Is Prime Member', value: 'isPrimeMember' },
      { label: 'Prime ID', value: 'primeId' },
      {
        label: 'Selected Events',
        value: row => Array.isArray(row.selectedEvents) ? row.selectedEvents.join(', ') : '',
      },
      { label: 'Strength', value: 'strength' },
      { label: 'Transaction ID', value: 'transactionId' },
      { label: 'Total Amount', value: 'totalAmount' },
      { label: 'Payment Signature', value: 'paymentSignature' },
      {
        label: 'Team Members',
        value: 'teamMembers'
      },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(dataToExport);

    fs.writeFileSync('persona.csv', csv);

    res.status(200).json({ teams, eventCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}